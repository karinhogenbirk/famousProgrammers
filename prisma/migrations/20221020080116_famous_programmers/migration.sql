-- CreateTable
CREATE TABLE "Programmer" (
    "name" TEXT NOT NULL,
    "knownFor" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "vote" INTEGER NOT NULL,

    CONSTRAINT "Programmer_pkey" PRIMARY KEY ("id")
);


-- CreateIndex
CREATE UNIQUE INDEX "Programmer_name_key" ON "Programmer"("name");
