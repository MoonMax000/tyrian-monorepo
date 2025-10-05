'use client';

import Label from '@/components/UI/Label/Label';
import Button from '@/components/UI/Button/Button';
import Separator from '@/components/UI/Separator/Separator';

import IconKey from '@/assets/icons/key.svg';
import IconMail from '@/assets/icons/mail.svg';
import IconPersonSubmit from '@/assets/icons/person-submit.svg';


const SecuritySettings = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-blackedGray px-4 py-6 rounded-lg">
        <h1 className="text-lg font-bold">Two-Factor Authentication</h1>
        <div className="flex flex-col gap-6 pt-6">
          <div className="flex items-center">
            <div className="bg-[#272a32] p-2.5 rounded-full">
              <IconMail className="opacity-50" />
            </div>
            <div className="flex flex-col gap-2 flex-1 pl-3">
              <Label>Phone Number Verification</Label>
              <span className="text-[12px] font-semibold text-[#87888b]">Send a text message to your mobile devices when logging in to your account</span>
            </div>
            <Button>Enable</Button>
          </div>
          <Separator />
          <div className="flex items-center">
            <div className="bg-[#272a32] p-2.5 rounded-full">
              <IconKey className="opacity-50" />
            </div>
            <div className="flex flex-col gap-2 flex-1 pl-3">
              <Label>Backup Codes</Label>
              <span className="text-[12px] font-semibold text-[#87888b]">Can be used to log in if you don’t have access to your phone</span>
            </div>
            <Button variant="secondary" disabled={true}>Create Code</Button>
          </div>
        </div>
      </div>
      <div className="bg-blackedGray px-4 py-6 rounded-lg">
        <h1 className="text-lg font-bold">Privacy Settings</h1>
        <div className="flex flex-col gap-6 pt-6">
          <div className="flex items-center">
            <div className="bg-[#272a32] p-2.5 rounded-full">
              <IconPersonSubmit className="opacity-50" />
            </div>
            <div className="flex flex-col gap-2 flex-1 pl-3">
              <Label>All users can start private chats with me</Label>
              <span className="text-[12px] font-semibold text-[#87888b]">This setting will prevent other users from starting new private chats with you</span>
            </div>
            <Button variant="danger">Disable</Button>
          </div>
          <Separator />
          <div className="flex items-center">
            <div className="bg-[#272a32] p-2.5 rounded-full">
              <IconKey className="opacity-50" />
            </div>
            <div className="flex flex-col gap-2 flex-1 pl-3">
              <Label>Ignore users</Label>
              <span className="text-[12px] font-semibold text-[#87888b]">Block private messages from ignored users. Note that these users won’t be able to message you, and their comments on posts will be hidden</span>
            </div>
            <Button variant="secondary" className='!h-12'>Blacklist</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;