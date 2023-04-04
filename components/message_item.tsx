/* eslint-disable react/jsx-props-no-spreading */
import ResizeTextarea from 'react-autosize-textarea';
import { Box, Button, Divider, Flex, Text, Textarea, UseToastOptions, useToast } from '@chakra-ui/react';
import { formatDistanceStrict } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { InMessage } from '@/models/message/in_message';
import CustomAvatar from './custom_avatar';
import BadReqErr from '@/controllers/error/bad_request';

type Props = {
  uid: string;
  displayName: string;
  photoURL: string;
  isOwner: boolean;
  item: InMessage;
  onSendSuccess: () => void;
};

async function postReply({ uid, id, reply }: { uid: string; id: string; reply: string }) {
  try {
    const resp = await fetch('/api/message.reply', {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        uid,
        id,
        reply,
      }),
    });
    if (resp.status !== 201) {
      throw new BadReqErr('postReply fetch에 실패했습니다.');
    }
    return true;
  } catch (error) {
    return false;
  }
}

const MessageItem: React.FC<Props> = function ({ uid, photoURL, displayName, isOwner, item, onSendSuccess }) {
  const [messageDistance, setMessageDistance] = useState('0초');
  const [replyDistance, setReplyDistance] = useState('0초');
  const [reply, setReply] = useState('');
  const [lastToastTime, setLastToastTime] = useState(0);
  const toast = useToast();
  const haveReply = !!item.reply;

  function throttleToast(options: UseToastOptions, delay = 1000) {
    const now = Date.now();
    if (now - lastToastTime < delay) return;
    toast(options);
    setLastToastTime(now);
  }

  useEffect(() => {
    setMessageDistance(convertDateToString(item.createAt));
  }, [item.createAt]);
  useEffect(() => {
    if (!item.replyAt) return;
    setReplyDistance(convertDateToString(item.replyAt));
  }, [item.replyAt]);

  return (
    <Flex px="3" py="2" w="md" direction="column" gap="2" bgColor="white" borderRadius="md">
      <Flex gap="2" align="center">
        <CustomAvatar size="xs" />
        <Text fontSize="sm">{displayName}</Text>
        <Text fontSize="sm" color="gray.400">
          {messageDistance}
        </Text>
      </Flex>
      <Textarea
        borderColor="gray.200"
        px="2"
        py="1"
        resize="none"
        minH="unset"
        value={item.message}
        as={ResizeTextarea}
      />
      {haveReply && (
        <Flex direction="column" gap="2">
          <Divider />
          <Flex gap="2">
            <CustomAvatar size="xs" src={photoURL} />
            <Box bgColor="gray.200" w="full" px="2" py="2" borderRadius="md">
              <Flex gap="2">
                <Text fontSize="sm">{item.author?.displayName}</Text>
                <Text fontSize="sm" color="gray.400">
                  {replyDistance}
                </Text>
              </Flex>
              <Text>{item.reply}</Text>
            </Box>
          </Flex>
        </Flex>
      )}
      {!haveReply && isOwner && (
        <Flex direction="column" gap="2">
          <Divider />
          <Flex gap="2">
            <CustomAvatar size="xs" src={photoURL} />
            <Textarea
              bgColor="gray.100"
              resize="none"
              border="none"
              placeholder="답변을 입력해주세요"
              minH="unset"
              as={ResizeTextarea}
              maxRows={7}
              value={reply}
              onChange={(e) => {
                const regaxLine = /\n/g;
                const lineCount = (e.currentTarget.value.match(regaxLine)?.length ?? 1) + 1;
                if (lineCount > 7) {
                  throttleToast({
                    status: 'error',
                    title: '최대 7줄까지 작성 가능합니다.',
                    position: 'bottom-right',
                    isClosable: true,
                    duration: 3000,
                  });
                  return;
                }
                setReply(e.currentTarget.value);
              }}
            />
            <Button
              colorScheme="yellow"
              bgColor="yellow.400"
              color="white"
              onClick={async () => {
                const result = await postReply({
                  uid,
                  id: item.id,
                  reply,
                });
                if (result === false) {
                  toast({
                    status: 'error',
                    title: '답변에 실패했습니다.',
                    position: 'bottom-right',
                    isClosable: true,
                    duration: 3000,
                  });
                  return;
                }
                toast({
                  status: 'success',
                  title: '답변을 등록하였습니다.',
                  position: 'bottom-right',
                  isClosable: true,
                  duration: 3000,
                });
                setReply('');
                onSendSuccess();
              }}
            >
              답변
            </Button>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

function convertDateToString(stringDate: string) {
  const now = new Date();
  const date = new Date(stringDate);
  const distance = formatDistanceStrict(now, date, {
    locale: ko,
  });
  return distance;
}

export default MessageItem;
