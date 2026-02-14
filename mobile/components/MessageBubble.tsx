import { View, Text } from 'react-native'
import React from 'react'
import { Message } from '@/types';

interface MessageBubbleProps {
    message: Message;
    isFromMe: boolean;
  }

const MessageBubble = ({ message, isFromMe }: MessageBubbleProps) => {
  return (
    <View>
      <Text>MessageBubble</Text>
    </View>
  )
}

export default MessageBubble