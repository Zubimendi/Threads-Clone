import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { httpRouter } from "convex/server";

const http = httpRouter();

export const UserActions = httpAction(async (ctx, request) => {
  // implementation will be here
  const { data, type } = await request.json();
  switch (type) {
    case "user.created":
      await ctx.runMutation(internal.users.createUsers, {
        clerkId: data.id,
        email: data.email_addresses[0].email_address,
        first_name: data.first_name,
        last_name: data.last_name,
        imageUrl: data.image_url,
        username: data.username,
        followersCount: 0,
      });
      break;
    case "user.updated":
      console.log("UPDATED");
      break;
  }
  return new Response();
});

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: UserActions,
});

//https://deafening-hamster-785.convex.site/clerk-users-webhook

export default http;