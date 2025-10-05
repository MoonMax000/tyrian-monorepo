import { UserProfile } from '@tyrian/shared/ui';

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8">
      <UserProfile authServiceUrl="http://localhost:8001" />
    </div>
  );
}
