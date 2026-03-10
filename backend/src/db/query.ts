import { db } from "./index";
import { eq } from "drizzle-orm";
import {
  users,
  comments,
  commentReply,
  products,
  type NewUser,
  type NewComment,
  type NewProduct,
  type NewCommentReply,
} from "./schema";

// User Queries
export const createUser = async (data: NewUser) => {
  const [user] = await db.insert(users).values(data).returning();
  return user;
};

export const getUserById = async (id: string) => {
  return db.query.users.findFirst({ where: eq(users.id, id) });
};

export const updateUser = async (id: string, data: Partial<NewUser>) => {
  const [user] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning();
  return user;
};

export const upsertUser = async (data: NewUser) => {
  const existingUser = await getUserById(data.id);
  if (existingUser) return updateUser(data.id, data);
  return createUser(data);
};

// Product Queries
export const createProduct = async (data: NewProduct) => {
  const [product] = await db.insert(products).values(data).returning();
  return product;
};

export const getAllProducts = async (limit = 10, offset = 0) => {
  return db.query.products.findMany({
    limit,
    offset,

    with: {
      user: true,
    },

    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });
};

export const getProductById = async (id: string) => {
  return db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      user: true,
      likes: true,

      comments: {
        with: {
          user: true,
          likes: true,
          replies: {
            with: {
              user: true,
              likes: true,
            },
          },
        },

        orderBy: (comments, { desc }) => [desc(comments.createdAt)],
      },
    },
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });
};

export const getProductsByUserId = async (userId: string) => {
  return db.query.products.findMany({
    where: eq(products.userId, userId),
    with: {
      user: true,
    },
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });
};

export const updateProduct = async (id: string, data: Partial<NewProduct>) => {
  const [product] = await db
    .update(products)
    .set(data)
    .where(eq(products.id, id))
    .returning();
  return product;
};

// Comment Queries
export const createComment = async (data: NewComment) => {
  const [comment] = await db.insert(comments).values(data).returning();
  return comment;
};

export const deleteComment = async (id: string) => {
  const [comment] = await db
    .delete(comments)
    .where(eq(comments.id, id))
    .returning();
  return comment;
};

export const getCommentById = async (id: string) => {
  return db.query.comments.findFirst({
    where: eq(comments.id, id),
    with: {
      user: true,
    },
  });
};

// Comment Reply Queries
export const createCommentReply = async (data: NewCommentReply) => {
  const [commentRep] = await db.insert(commentReply).values(data).returning();
  return commentRep;
};

export const deleteCommentReply = async (id: string) => {
  const [commentRep] = await db
    .delete(commentReply)
    .where(eq(commentReply.id, id))
    .returning();
  return commentRep;
};

export const getCommentReplyById = async (id: string) => {
  return db.query.commentReply.findFirst({
    where: eq(commentReply.id, id),
    with: {
      user: true,
    },
  });
};
