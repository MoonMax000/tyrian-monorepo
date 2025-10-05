import React from 'react';

import Label from '@/components/UI/Label/Label';
import Checkbox from '@/components/UI/Checkbox/Checkbox';
import Separator from '@/components/UI/Separator/Separator';
import Button from '@/components/UI/Button/Button';

const NotificationsSettings = () => {
  return (
    <div className="bg-blackedGray px-4 py-6 rounded-lg">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold">Notifications</h2>
          <div className="flex items-center">
            <Label className="flex-1 text-[#87888b]">Enable notification sound</Label>
            <Checkbox checked={true} />
          </div>
          <div className="flex items-center">
            <Label className="flex-1 text-[#87888b]">Show desktop notifications</Label>
            <Checkbox checked={true} />
          </div>
          <div className="flex items-center">
            <Label className="flex-1 text-[#87888b]">Emails about suspicious login attempts to your account</Label>
            <Checkbox checked={true} />
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold">Your Profile</h2>
          <div className="flex items-center">
            <Label className="flex-1 text-[#87888b]">When someone follows you</Label>
            <div className="flex gap-[58px]">
              <div className="relative">
                <span
                  className="text-[#b8b8b8] text-[13px] absolute left-1/2 bottom-7 transform -translate-x-1/2 whitespace-nowrap">E-mail</span>
                <Checkbox checked={false} />
              </div>
              <div className="relative">
                <span
                  className="text-[#b8b8b8] text-[13px] absolute left-1/2 bottom-7 transform -translate-x-1/2 whitespace-nowrap">Web</span>
                <Checkbox checked={true} />
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <Label className="flex-1 text-[#87888b]">When someone mentions you in idea comments</Label>
            <div className="flex gap-[58px]">
              <Checkbox checked={true} />
              <Checkbox checked={true} />
            </div>
          </div>
          <div className="flex items-center">
            <Label className="flex-1 text-[#87888b]">When you’re mentioned in chat while offline</Label>
            <Checkbox checked={true} />
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold">Your Ideas</h2>
          <div className="flex items-center">
            <Label className="flex-1 text-[#87888b]">When someone comments on your idea</Label>
            <div className="flex gap-[58px]">
              <div className="relative">
                <span
                  className="text-[#b8b8b8] text-[13px] absolute left-1/2 bottom-7 transform -translate-x-1/2 whitespace-nowrap">E-mail</span>
                <Checkbox checked={true} />
              </div>
              <div className="relative">
                <span
                  className="text-[#b8b8b8] text-[13px] absolute left-1/2 bottom-7 transform -translate-x-1/2 whitespace-nowrap">Web</span>
                <Checkbox checked={true} />
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <Label className="flex-1 text-[#87888b]">When someone liked your idea</Label>
            <div className="flex gap-[58px]">
              <Checkbox checked={true} />
              <Checkbox checked={true} />
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold">Authors You Follow</h2>
          <div className="flex items-center">
            <Label className="flex-1 text-[#87888b]">When they publish a new idea</Label>
            <div className="flex gap-[58px]">
              <div className="relative">
                <span
                  className="text-[#b8b8b8] text-[13px] absolute left-1/2 bottom-7 transform -translate-x-1/2 whitespace-nowrap">E-mail</span>
                <Checkbox checked={true} />
              </div>
              <div className="relative">
                <span
                  className="text-[#b8b8b8] text-[13px] absolute left-1/2 bottom-7 transform -translate-x-1/2 whitespace-nowrap">Web</span>
                <Checkbox checked={true} />
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <Label className="flex-1 text-[#87888b]">When they post a new post</Label>
            <div className="flex gap-[58px]">
              <Checkbox checked={true} />
              <Checkbox checked={true} />
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold">Ideas You Follow</h2>
          <div className="flex items-center">
            <Label className="flex-1 text-[#87888b]">When there’s an update</Label>
            <div className="flex gap-[58px]">
              <div className="relative">
                <span
                  className="text-[#b8b8b8] text-[13px] absolute left-1/2 bottom-7 transform -translate-x-1/2 whitespace-nowrap">E-mail</span>
                <Checkbox checked={true} />
              </div>
              <div className="relative">
                <span
                  className="text-[#b8b8b8] text-[13px] absolute left-1/2 bottom-7 transform -translate-x-1/2 whitespace-nowrap">Web</span>
                <Checkbox checked={true} />
              </div>
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold">Scripts You’ve Favorited or Rated</h2>
          <div className="flex items-center">
            <Label className="flex-1 text-[#87888b]">When there’s an update</Label>
            <div className="flex gap-[58px]">
              <div className="relative">
                <span
                  className="text-[#b8b8b8] text-[13px] absolute left-1/2 bottom-7 transform -translate-x-1/2 whitespace-nowrap">E-mail</span>
                <Checkbox checked={true} />
              </div>
              <div className="relative">
                <span
                  className="text-[#b8b8b8] text-[13px] absolute left-1/2 bottom-7 transform -translate-x-1/2 whitespace-nowrap">Web</span>
                <Checkbox checked={true} />
              </div>
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold">Opinions</h2>
          <div className="flex items-center">
            <Label className="flex-1 text-[#87888b]">When someone mentions you in an opinion</Label>
            <div className="flex gap-[58px]">
              <div className="relative">
                <span
                  className="text-[#b8b8b8] text-[13px] absolute left-1/2 bottom-7 transform -translate-x-1/2 whitespace-nowrap">E-mail</span>
                <Checkbox checked={true} />
              </div>
              <div className="relative">
                <span
                  className="text-[#b8b8b8] text-[13px] absolute left-1/2 bottom-7 transform -translate-x-1/2 whitespace-nowrap">Web</span>
                <Checkbox checked={true} />
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <Label className="flex-1 text-[#87888b]">When someone mentions you in a comment on an opinion</Label>
            <div className="flex gap-[58px]">
              <Checkbox checked={true} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center pt-12 gap-4">
        <Button variant="secondary">Unsubscribe from all</Button>
        <Button>Save changes</Button>
      </div>
    </div>
  );
};

export default NotificationsSettings;