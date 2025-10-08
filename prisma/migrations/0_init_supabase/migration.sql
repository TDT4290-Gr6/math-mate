-- CreateTable
CREATE TABLE "User" (
    "id" BIGSERIAL NOT NULL,
    "score" DOUBLE PRECISION,
    "country" BIGINT NOT NULL,
    "uuid" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Problem" (
    "id" BIGSERIAL NOT NULL,
    "problem" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "level" SMALLINT NOT NULL,
    "title" TEXT,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Method" (
    "id" BIGSERIAL NOT NULL,
    "problemId" BIGINT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Method_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Step" (
    "id" BIGSERIAL NOT NULL,
    "methodId" BIGINT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Step_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" BIGSERIAL NOT NULL,
    "loggedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    "sessionId" BIGINT NOT NULL,
    "actionName" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "userId" BIGINT NOT NULL,
    "problemId" BIGINT,
    "methodId" BIGINT,
    "stepId" BIGINT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Solves" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "problemId" BIGINT NOT NULL,
    "attempts" INTEGER NOT NULL,
    "startedSolvingAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedSolvingAt" TIMESTAMPTZ(6),
    "stepsUsed" INTEGER NOT NULL,
    "feedback" INTEGER,

    CONSTRAINT "solves_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Country_id_key" ON "Country"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Country_Name_key" ON "Country"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_id_key" ON "Problem"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Method_id_key" ON "Method"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Step_id_key" ON "Step"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Event_id_key" ON "Event"("id");

-- CreateIndex
CREATE UNIQUE INDEX "solves_id_key" ON "Solves"("id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_Country_fkey" FOREIGN KEY ("country") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Method" ADD CONSTRAINT "Method_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Step" ADD CONSTRAINT "step_methodId_fkey" FOREIGN KEY ("methodId") REFERENCES "Method"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_method_fkey" FOREIGN KEY ("methodId") REFERENCES "Method"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_step_fkey" FOREIGN KEY ("stepId") REFERENCES "Step"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solves" ADD CONSTRAINT "solves_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solves" ADD CONSTRAINT "solves_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

