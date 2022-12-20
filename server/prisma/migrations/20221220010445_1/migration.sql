-- CreateTable
CREATE TABLE "TypeTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "typeId2" TEXT NOT NULL,
    CONSTRAINT "Task_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "TypeTask" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CommentTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    CONSTRAINT "CommentTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
