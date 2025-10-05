import { FC, useState } from 'react';
import Paper from '@/components/ui/Paper/Paper';
import TrashIcon from '@/assets/icons/icon-trash.svg';
import { IndicatorTag } from '@/components/ui/IndicatorTag/IndicatorTag';
import { getCookie } from '@/utilts/cookie';
import { AuthService, UserSession } from '@/services/AuthService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ModalWrapper from '@/components/ModalWrapper';
import { DeleteSession } from '@/components/modals/DeleteSession/DeleteSession';

const headers = [
  'Device',
  'ID',
  'Created at',
  'Expired at',
  'Status',
  'Actions',
];

function formatDate(date: string) {
  return new Date(date).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const UserSessions: FC = () => {
  const queryClient = useQueryClient();
  const currentSessionId = getCookie('sessionid');

  const { data: sessions = [], isLoading } = useQuery<UserSession[]>({
    queryKey: ['sessions'],
    queryFn: () => AuthService.getSessions(),
  });

  const { mutate: deleteSession } = useMutation({
    mutationFn: (sessionId: number) => AuthService.deleteSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });

  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(
    null,
  );

  const handleClose = () => setSelectedSessionId(null);
  const handleConfirm = () => {
    if (selectedSessionId) {
      deleteSession(selectedSessionId);
      handleClose();
    }
  };

  return (
    <Paper className='p-4'>
      <div className='flex flex-col justify-start items-start border-b border-b-regaliaPurple pb-1'>
        <h2 className='text-2xl font-bold'>User sessions</h2>
        <span className='text-[15px] font-normal'>
          Here you can see all active sessions on your account. Each session
          shows the device and login time. If you don’t recognize a session, you
          can end it to protect your account.
        </span>
      </div>

      <div className='pt-4 flex flex-col gap-6'>
        <div className='w-full flex flex-col gap-4'>
          <div className='grid grid-cols-[30%_15%_15%_15%_10%_auto] gap-4 text-xs uppercase font-semibold text-lighterAluminum'>
            {headers.map((header) => (
              <div key={header} className='last:text-center'>
                {header}
              </div>
            ))}
          </div>

          {isLoading ? (
            <div>Loading...</div>
          ) : (
            sessions.map(
              ({
                id,
                session_id,
                ip_address,
                fingerprint,
                created_at,
                expires_at,
                status,
              }) => (
                <div
                  key={session_id}
                  className='grid grid-cols-[30%_15%_15%_15%_10%_auto] gap-4 text-[15px] font-medium'
                >
                  <div className='flex flex-col gap-[2px]'>
                    <span>{fingerprint}</span>
                    {session_id === currentSessionId && (
                      <span className='text-[12px] text-primary'>
                        Current session
                      </span>
                    )}
                  </div>
                  <div>{ip_address}</div>
                  <div>{formatDate(created_at)}</div>
                  <div>{formatDate(expires_at)}</div>
                  <div className='w-fit'>
                    <IndicatorTag
                      type={status === 'active' ? 'darckGreen' : 'red'}
                    >
                      {status}
                    </IndicatorTag>
                  </div>
                  <div
                    className='flex justify-center text-right cursor-pointer'
                    onClick={() => setSelectedSessionId(id)}
                  >
                    <TrashIcon />
                  </div>
                </div>
              ),
            )
          )}
        </div>
      </div>

      {selectedSessionId && (
        <ModalWrapper onClose={handleClose}>
          <DeleteSession onSubmit={handleConfirm} onClose={handleClose} />
        </ModalWrapper>
      )}
    </Paper>
  );
};
