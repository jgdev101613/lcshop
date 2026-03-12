import {
  boolean,
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  uniqueIndex,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const statusEnum = pgEnum("status", [
  "Available",
  "Sold",
  "Out Of Stock",
  "Unavailable",
]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  imageUrl: text("image_url"),
  isVerified: boolean("is_verifed").notNull().default(false),
  socials: jsonb("socials").$type<{
    facebook?: string;
    instagram?: string;
    x?: string;
  }>(),
  location: text("location").notNull().default("Lucena"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
  status: statusEnum().default("Available"),
  stock: integer("stock").notNull().default(1),
  category: text("category").notNull(),
  subCategory: text("sub_category"),
  location: text("location").notNull().default("Lucena"),
  imageUrls: text("image_urls").array().notNull().default([]),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const commentReply = pgTable("comment_replies", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),

  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  commentId: uuid("comment_id")
    .notNull()
    .references(() => comments.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const postLikes = pgTable(
  "post_likes",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("unique_post_like").on(table.userId, table.productId),
  ],
);

export const commentLikes = pgTable(
  "comment_likes",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    commentId: uuid("comment_id")
      .notNull()
      .references(() => comments.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("unique_comment_like").on(table.userId, table.commentId),
  ],
);

export const replyLikes = pgTable(
  "reply_likes",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    replyId: uuid("reply_id")
      .notNull()
      .references(() => commentReply.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("unique_reply_like").on(table.userId, table.replyId)],
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
  comments: many(comments),
  postLikes: many(postLikes),
  commentLikes: many(commentLikes),
  replyLikes: many(replyLikes),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  comments: many(comments),
  likes: many(postLikes),
  user: one(users, { fields: [products.userId], references: [users.id] }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),

  product: one(products, {
    fields: [comments.productId],
    references: [products.id],
  }),

  replies: many(commentReply),
  likes: many(commentLikes),
}));

export const commentReplyRelations = relations(
  commentReply,
  ({ one, many }) => ({
    user: one(users, {
      fields: [commentReply.userId],
      references: [users.id],
    }),

    comment: one(comments, {
      fields: [commentReply.commentId],
      references: [comments.id],
    }),

    likes: many(replyLikes),
  }),
);

export const postLikesRelations = relations(postLikes, ({ one }) => ({
  user: one(users, {
    fields: [postLikes.userId],
    references: [users.id],
  }),

  product: one(products, {
    fields: [postLikes.productId],
    references: [products.id],
  }),
}));

export const commentLikesRelations = relations(commentLikes, ({ one }) => ({
  user: one(users, {
    fields: [commentLikes.userId],
    references: [users.id],
  }),

  comment: one(comments, {
    fields: [commentLikes.commentId],
    references: [comments.id],
  }),
}));

export const replyLikesRelations = relations(replyLikes, ({ one }) => ({
  user: one(users, {
    fields: [replyLikes.userId],
    references: [users.id],
  }),

  reply: one(commentReply, {
    fields: [replyLikes.replyId],
    references: [commentReply.id],
  }),
}));

// Type interface
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;

export type CommentReply = typeof commentReply.$inferSelect;
export type NewCommentReply = typeof commentReply.$inferInsert;
