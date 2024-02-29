-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(25),
    "name" VARCHAR(25),
    "password" VARCHAR(300),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypingHistory" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" INTEGER NOT NULL,
    "wpm" INTEGER NOT NULL,
    "wrongCharacters" VARCHAR(500),

    CONSTRAINT "TypingHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" SERIAL NOT NULL,
    "quoteString" VARCHAR(300) NOT NULL,
    "typingHistoryId" INTEGER NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Quote_typingHistoryId_key" ON "Quote"("typingHistoryId");

-- AddForeignKey
ALTER TABLE "TypingHistory" ADD CONSTRAINT "TypingHistory_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_typingHistoryId_fkey" FOREIGN KEY ("typingHistoryId") REFERENCES "TypingHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
