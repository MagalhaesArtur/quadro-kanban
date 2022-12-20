-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "typeId2" TEXT,
    CONSTRAINT "Task_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "TypeTask" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("content", "id", "priority", "type", "typeId", "typeId2") SELECT "content", "id", "priority", "type", "typeId", "typeId2" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
