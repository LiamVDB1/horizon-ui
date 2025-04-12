import { cookies } from 'next/headers';

import { Chat } from '@/components/core/chat/chat';
import { generateUUID } from '@/lib/utils';

export default async function Page() {
  const id = generateUUID();

  const cookieStore = await cookies();

  return (
    <Chat
      key={id}
      id={id}
      initialMessages={[]}
    />
  );
}
