import { prisma } from "@calcom/prisma";
import type { TrpcSessionUser } from "@calcom/trpc/server/types";

type MyBookingStatsOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
};

/**
 * Returns the logged-in organizer's bookings grouped by event type, for the
 * booking activity widget on the dashboard. We read from the denormalized
 * booking table so the widget can render without joining bookings against
 * event types on every request.
 */
export const myBookingStatsHandler = async ({ ctx }: MyBookingStatsOptions) => {
  const { user } = ctx;

  const grouped = await prisma.bookingDenormalized.groupBy({
    by: ["eventTypeId", "title"],
    where: {
      userId: user.id,
    },
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
  });

  return grouped.map((row) => ({
    eventTypeId: row.eventTypeId,
    eventType: row.title,
    count: row._count.id,
  }));
};

export default myBookingStatsHandler;
