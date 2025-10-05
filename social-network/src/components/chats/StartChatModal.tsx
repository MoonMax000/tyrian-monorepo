import { useState, FC } from 'react';
import { ChatModalAdd } from './StartChatModalContent/ChatModalAdd';
import { ChatModalGroup } from './StartChatModalContent/ChatModalGroup';
import { ChatModalServer } from './StartChatModalContent/ChatModalServer';

export type TChatsModal = 'chat' | 'group' | 'server' | 'addChat' | null;

export interface GroupInfo {
  description?: string;
  name: string;
}

interface StartChatModalProps {
  type?: TChatsModal;
  onClose?: (arg: boolean) => void;
}

const StartChatModal: FC<StartChatModalProps> = ({ type, onClose }) => {
  const [modalType, setModalType] = useState<TChatsModal>(type ?? 'chat');
  const [createStep, setCreateStep] = useState(0);
  const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);
  const [visible, setVisible] = useState<'search' | 'hidden'>('search');
  const titleMap: Record<Exclude<TChatsModal, null>, string> = {
    chat: 'Start chat',
    group: 'New Group',
    server: 'New Channel',
    addChat: 'Invitations',
  };

  if (
    modalType &&
    (modalType === 'chat' || modalType === 'addChat' || (modalType && createStep === 1))
  ) {
    return (
      <ChatModalAdd
        onClose={onClose}
        groupInfo={groupInfo}
        modalType={modalType}
        title={titleMap[modalType]}
      />
    );
  }

  if (modalType === 'group' && createStep === 0) {
    return (
      <ChatModalGroup
        fromServer={false}
        visible={visible}
        setVisible={setVisible}
        title={titleMap[modalType]}
        setModalType={setModalType}
        setCreateStep={setCreateStep}
        setGroupInfo={setGroupInfo}
      />
    );
  }

  if (modalType === 'server') {
    return (
      <ChatModalServer
        fromServer={false}
        setVisible={setVisible}
        visible={visible}
        title={titleMap[modalType]}
      />
    );
  }

  return null;
};

export default StartChatModal;
