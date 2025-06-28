import Admin from '../routes/Admin';
import type { UserObj } from '../types';

interface PageProps {
  userObj: UserObj | null;
}

export default function AdminPage({ userObj }: PageProps) {
  return <Admin userObj={userObj} />;
}
