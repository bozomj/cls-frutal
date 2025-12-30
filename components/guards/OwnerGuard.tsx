type OwnerGuardProps = {
  isOwner: boolean;
  children: React.ReactNode;
};

export default function OwnerGuard({ isOwner, children }: OwnerGuardProps) {
  if (!isOwner) return null;

  return <>{children}</>;
}
