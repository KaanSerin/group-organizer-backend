-- CreateTable
CREATE TABLE "user_group_events" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_group_events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_group_events" ADD CONSTRAINT "user_group_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_group_events" ADD CONSTRAINT "user_group_events_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_group_events" ADD CONSTRAINT "user_group_events_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "group_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
