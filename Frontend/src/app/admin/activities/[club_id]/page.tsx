type paramType = {
  club_id: string;
};

export default async function ActivitiesPageByClubId({
  params,
}: {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { club_id } = (await params) as paramType;

  return <>Activities Page for Club ID: {club_id}</>;
}
