type paramType = {
  member_id: string;
};
export default async function MembersPage({
  params,
}: {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { member_id } = (await params) as paramType;

  return <>Member ID: {member_id}</>;
}
