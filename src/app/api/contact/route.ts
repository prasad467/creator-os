export async function POST(req: Request) {
  try {
    const { name, email, message, website } = await req.json();

    // Honeypot spam protection
    if (website) {
      return Response.json({ success: true });
    }

    if (!name || !email || !message) {
      return Response.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    console.log("New Contact Message:");
    console.log({ name, email, message });

    // Later you connect email service here

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}