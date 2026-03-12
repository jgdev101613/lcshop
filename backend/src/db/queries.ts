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

type UpdateUser = Partial<Omit<NewUser, "id" | "createdAt">>;

// User Queries
export const createUser = async (data: NewUser) => {
  const [user] = await db.insert(users).values(data).returning();
  return user;
};

export const getUserById = async (id: string) => {
  return db.query.users.findFirst({ where: eq(users.id, id) });
};

export const updateUser = async (id: string, data: UpdateUser) => {
  const [user] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning();

  if (!user) {
    throw new Error(`User with id ${id} not found`);
  }

  return user;
};

export const upsertUser = async (data: NewUser) => {
  const [user] = await db
    .insert(users)
    .values(data)
    .onConflictDoUpdate({
      target: users.id,
      set: data,
    })
    .returning();
  return user;
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
  const existingProduct = getProductById(id);

  if (!existingProduct) {
    throw new Error(`Product with id ${id} not found`);
  }

  const [product] = await db
    .update(products)
    .set(data)
    .where(eq(products.id, id))
    .returning();
  return product;
};

export const deleteProduct = async (id: string) => {
  const existingProduct = getProductById(id);

  if (!existingProduct) {
    throw new Error(`Product with id ${id} not found`);
  }

  const [product] = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning();
  return product;
};

// Comment Queries
export const createComment = async (data: NewComment) => {
  const [comment] = await db.insert(comments).values(data).returning();
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

export const deleteComment = async (id: string) => {
  const existingComment = getCommentById(id);

  if (!existingComment) {
    throw new Error(`Comment with id ${id} not found`);
  }

  const [comment] = await db
    .delete(comments)
    .where(eq(comments.id, id))
    .returning();
  return comment;
};

// Comment Reply Queries
export const createCommentReply = async (data: NewCommentReply) => {
  const [commentRep] = await db.insert(commentReply).values(data).returning();
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

export const deleteCommentReply = async (id: string) => {
  const existingCommentReply = getCommentReplyById(id);

  if (!existingCommentReply) {
    throw new Error(`Comment Reply with id ${id} not found`);
  }

  const [commentRep] = await db
    .delete(commentReply)
    .where(eq(commentReply.id, id))
    .returning();
  return commentRep;
};
