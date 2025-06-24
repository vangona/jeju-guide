import MyPlace from '../routes/MyPlace';
import type { UserObj } from '../types';

interface PageProps {
  userObj: UserObj | null;
}

export default function MyPlacePage({ userObj }: PageProps) {
  return <MyPlace userObj={userObj} />;
}