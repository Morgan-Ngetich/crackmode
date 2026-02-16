// ProblemsPopover.tsx
import { HStack, VStack, Text, Box, Popover, Portal } from '@chakra-ui/react';

interface ProblemsPopoverProps {
  totalSolved: number;
  totalEasy: number;
  totalMedium: number;
  totalHard: number;
  isFirst: boolean;
  isTopThree: boolean;
}

export function ProblemsPopover({ 
  totalSolved, 
  totalEasy, 
  totalMedium, 
  totalHard,
  isFirst,
  isTopThree 
}: ProblemsPopoverProps) {
  return (
    <Popover.Root lazyMount unmountOnExit>
      <Popover.Trigger asChild>
        <Box 
          cursor="pointer" 
          display="inline-block"
          transition="all 0.2s"
          _hover={{ transform: 'scale(1.05)' }}
        >
          <VStack gap={0} align="end">
            <Text 
              fontSize={isFirst ? 'xl' : isTopThree ? 'lg' : 'md'} 
              fontWeight="black"
              color={isTopThree ? {base: 'orange.500', _dark: 'orange.400'} : 'fg.muted'}
            >
              {totalSolved}
            </Text>
            <Text fontSize="xs" color="fg.muted">
              solved
            </Text>
          </VStack>
        </Box>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content 
            bg="gray.900" 
            borderColor="gray.700" 
            borderWidth={1}
            boxShadow="xl"
            p={0}
            w="280px"
            zIndex={1500}
          >
            <Popover.Arrow>
              <Popover.ArrowTip borderTopColor="gray.700" />
            </Popover.Arrow>
            <Popover.Body p={4}>
              <VStack align="stretch" gap={3}>
                <Text fontSize="sm" fontWeight="bold" color="gray.300" mb={1}>
                  Problems Solved
                </Text>
                
                {/* Total */}
                <HStack justify="space-between" py={2} borderBottomWidth={1} borderColor="gray.700">
                  <Text fontSize="sm" color="gray.400">Total</Text>
                  <Text fontSize="lg" fontWeight="black" color="gray.100">
                    {totalSolved}
                  </Text>
                </HStack>
                
                {/* Easy */}
                <HStack justify="space-between">
                  <HStack gap={2}>
                    <Box w={2} h={2} borderRadius="full" bg="green.500" />
                    <Text fontSize="sm" color="gray.300">Easy</Text>
                  </HStack>
                  <Text fontSize="md" fontWeight="bold" color="green.400">
                    {totalEasy}
                  </Text>
                </HStack>
                
                {/* Medium */}
                <HStack justify="space-between">
                  <HStack gap={2}>
                    <Box w={2} h={2} borderRadius="full" bg="yellow.500" />
                    <Text fontSize="sm" color="gray.300">Medium</Text>
                  </HStack>
                  <Text fontSize="md" fontWeight="bold" color="yellow.400">
                    {totalMedium}
                  </Text>
                </HStack>
                
                {/* Hard */}
                <HStack justify="space-between">
                  <HStack gap={2}>
                    <Box w={2} h={2} borderRadius="full" bg="red.500" />
                    <Text fontSize="sm" color="gray.300">Hard</Text>
                  </HStack>
                  <Text fontSize="md" fontWeight="bold" color="red.400">
                    {totalHard}
                  </Text>
                </HStack>
              </VStack>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}