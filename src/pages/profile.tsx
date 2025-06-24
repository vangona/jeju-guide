import Profile from '../routes/Profile';
import type { UserObj } from '../types';

interface PageProps {
  userObj: UserObj | null;
}

export default function ProfilePage({ userObj }: PageProps) {
  return <Profile userObj={userObj} />;
}