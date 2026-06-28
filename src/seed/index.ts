import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import {
  CommentStatus,
  PostStatus,
  Role,
} from "../prisma/generated/prisma/enums";

const USER_COUNT = 150;
const POST_COUNT = 300;
const COMMENT_COUNT = 800;

async function main() {
  console.log("🌱 Seeding...");

  // Delete in dependency order
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("123456", 10);

  // =========================
  // USERS
  // =========================

  const users = Array.from({ length: USER_COUNT }).map(() => ({
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password,
    role: faker.helpers.arrayElement([
      Role.USER,
      Role.USER,
      Role.USER,
      Role.AUTHOR,
      Role.ADMIN,
    ]),
  }));

  await prisma.user.createMany({
    data: users,
  });

  const createdUsers = await prisma.user.findMany({
    select: {
      id: true,
    },
  });

  // =========================
  // PROFILES
  // =========================

  await prisma.profile.createMany({
    data: createdUsers.map((user) => ({
      userId: user.id,
      bio: faker.lorem.sentence(),
      profilePhoto: faker.image.avatar(),
    })),
  });

  // =========================
  // POSTS
  // =========================

  const posts = Array.from({ length: POST_COUNT }).map(() => {
    const author = faker.helpers.arrayElement(createdUsers);

    return {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(3),
      thumbnail: faker.image.urlPicsumPhotos(),
      isFeatured: faker.datatype.boolean(),
      status: faker.helpers.arrayElement([
        PostStatus.DRAFT,
        PostStatus.PUBLISHED,
        PostStatus.ARCHIVED,
      ]),
      tags: faker.helpers.arrayElements(
        [
          "typescript",
          "node",
          "express",
          "prisma",
          "postgres",
          "docker",
          "react",
          "nextjs",
          "mongodb",
          "jwt",
        ],
        faker.number.int({ min: 2, max: 5 }),
      ),
      views: faker.number.int({ min: 0, max: 10000 }),
      authorId: author.id,
    };
  });

  await prisma.post.createMany({
    data: posts,
  });

  const createdPosts = await prisma.post.findMany({
    select: {
      id: true,
    },
  });

  // =========================
  // COMMENTS
  // =========================

  const comments = Array.from({ length: COMMENT_COUNT }).map(() => ({
    content: faker.lorem.sentences(2),
    authorId: faker.helpers.arrayElement(createdUsers).id,
    postId: faker.helpers.arrayElement(createdPosts).id,
    status: faker.helpers.arrayElement([
      CommentStatus.APPROVED,
      CommentStatus.REJECT,
    ]),
  }));

  await prisma.comment.createMany({
    data: comments,
  });

  console.log("✅ Seed completed");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
