import { auth } from "@/app/(auth)/auth";
import { getChatsByUserId, getChatsByUserIdAndProject } from "@/db/queries";

export async function GET(request: Request) {
  const session = await auth();

  if (!session || !session.user) {
    return Response.json("Unauthorized!", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  try {
    let chats;
    
    if (projectId === 'null') {
      // Get chats with no project
      chats = await getChatsByUserIdAndProject({ 
        userId: session.user.id!, 
        projectId: null 
      });
    } else if (projectId) {
      // Get chats for specific project
      chats = await getChatsByUserIdAndProject({ 
        userId: session.user.id!, 
        projectId 
      });
    } else {
      // Get all chats (when no projectId specified or VIEW_ALL)
      chats = await getChatsByUserId({ id: session.user.id! });
    }

    return Response.json(chats);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return Response.json("Internal Server Error", { status: 500 });
  }
}
