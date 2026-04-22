import {
  AddSimilarProductsPayload,
  CommentCreatePayload,
  ICommentEntity,
  IProductImageEntity,
  IProductSearchFilter
} from "../types";
import { mapCommentEntity } from "./services/mapping";
import { mapImageEntity } from "./services/mapping";
import { IComment, IProduct, IProductImage } from "@Shared/types";
import { isUUID } from "validator";

type CommentValidator = (comment: CommentCreatePayload) => string | null;

export const validateComment: CommentValidator = (comment) => {
  if (!comment || !Object.keys(comment).length) {
    return "Comment is absent or empty";
  }

  const requiredFields = new Set<keyof CommentCreatePayload>([
    "name",
    "email",
    "body",
    "productId"
  ]);

  let wrongFieldName;

  requiredFields.forEach((fieldName) => {
    if (!comment[fieldName]) {
      wrongFieldName = fieldName;
      return;
    }
  });

  if (wrongFieldName) {
    return `Field '${wrongFieldName}' is absent`;
  }

  return null;
}

const compareValues = (target: string, compare: string): boolean => {
  return target.toLowerCase() === compare.toLowerCase();
}

export const checkCommentUniq = (payload: CommentCreatePayload, comments: IComment[]): boolean => {
  const byEmail = comments.find(({ email }) => compareValues(payload.email, email));

  if (!byEmail) {
    return true;
  }

  const { body, name, productId } = byEmail;
  return !(
    compareValues(payload.body, body) &&
    compareValues(payload.name, name) &&
    compareValues(payload.productId, productId)
  );
}

export const enhanceProductsComments = (
  products: IProduct[],
  commentRows: ICommentEntity[]
): IProduct[] => {
  const commentsByProductId = new Map<string, IComment[]>();

  for (let commentEntity of commentRows) {
    const comment = mapCommentEntity(commentEntity);
    if (!commentsByProductId.has(comment.productId)) {
      commentsByProductId.set(comment.productId, []);
    }

    const list = commentsByProductId.get(comment.productId) ?? [];
    commentsByProductId.set(comment.productId, [...list, comment]);
  }

  for (let product of products) {
    if (commentsByProductId.has(product.id)) {
      product.comments = commentsByProductId.get(product.id);
    }
  }

  return products;
}

export const getProductsFilterQuery = (filter: IProductSearchFilter): [string, string[]] => {
  const { title, description, priceFrom, priceTo } = filter;

  let query = "SELECT * FROM products WHERE ";
  const values = [];

  if (title) {
    query += "title LIKE ? ";
    values.push(`%${title}%`);
  }

  if (description) {
    if (values.length) {
      query += " OR ";
    }

    query += "description LIKE ? ";
    values.push(`%${description}%`);
  }

  if (priceFrom || priceTo) {
    if (values.length) {
      query += " OR ";
    }

    query += `(price > ? AND price < ?)`;
    values.push(String(priceFrom || 0));
    values.push(String(priceTo || 999999));
  }

  return [query, values];
}

export const enhanceProductsImages = (
  products: IProduct[],
  imageRows: IProductImageEntity[]
): IProduct[] => {
  const imagesByProductId = new Map<string, IProductImage[]>();
  const thumbnailsByProductId = new Map<string, IProductImage>();

  for (let imageEntity of imageRows) {
    const image = mapImageEntity(imageEntity);
    if (!imagesByProductId.has(image.productId)) {
      imagesByProductId.set(image.productId, []);
    }

    const list = imagesByProductId.get(image.productId) ?? [];
    imagesByProductId.set(image.productId, [...list, image]);

    if (image.main) {
      thumbnailsByProductId.set(image.productId, image);
    }
  }

  for (let product of products) {
    product.thumbnail = thumbnailsByProductId.get(product.id);

    if (imagesByProductId.has(product.id)) {
      product.images = imagesByProductId.get(product.id)!;

      if (!product.thumbnail) {
        product.thumbnail = product.images[0];
      }
    }
  }

  return products;
}

export const validateAddSimilarProductsBody = (items: AddSimilarProductsPayload = []): boolean => {
  if (!Array.isArray(items)) {
    throw new Error("Тело запроса не является массивом");
  }

  if (!items.length) {
    throw new Error("Массив пуст");
  }

  items?.forEach((connection: [string, string], index) => {
    if (connection?.length !== 2 || typeof connection?.[0] !== "string" || typeof connection?.[1] !== "string") {
      throw new Error(`Элемент массива с индексом ${index} не соответствует паре id`);
    }

    if (!isUUID(connection[0])) {
      throw new Error(`Значение ${connection[0]} элемента с индексом ${index} не является UUID`);
    }

    if (!isUUID(connection[1])) {
      throw new Error(`Значение ${connection[1]} элемента с индексом ${index} не является UUID`);
    }
  });

  return true;
}

export const validateRemoveSimilarProductsBody = (items: string[] = []): boolean => {
  if (!Array.isArray(items)) {
    throw new Error("Тело запроса не является массивом");
  }

  if (!items.length) {
    throw new Error("Массив пуст");
  }

  items?.forEach((id: string, index) => {
    if (!isUUID(id)) {
      throw new Error(`Значение ${id} с индексом ${index} не является UUID`);
    }
  });

  return true;
}
