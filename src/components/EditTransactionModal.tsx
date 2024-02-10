import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Stack,
  Input,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  RadioGroup,
  Radio,
  Box,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { Transaction } from "../types";

export type EditRecordFormSubmitPayload = {
  label: string;
  amount: number;
  isAddition: boolean;
};

export type EditTransactionModalRenderPropsParams = {
  onOpen?(): void;
};

export type EditTransactionModalProps = {
  children?(params: EditTransactionModalRenderPropsParams): React.ReactNode;
  transaction: Transaction;
  isSubmitting?: boolean;
  onSubmit?(
    transaction: Transaction,
    payload: EditRecordFormSubmitPayload
  ): void;
};

export default function EditTransactionModal({
  children,
  transaction,
  isSubmitting = false,
  onSubmit,
}: EditTransactionModalProps) {
  const [label, setLabel] = useState(transaction.label);
  const [amount, setAmount] = useState(transaction.amount);
  const [isAddition, setIsAddition] = useState(transaction.isAddition);

  const canSubmit = !!label && amount > 0;

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Reset on modal close
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, transaction]);

  function reset() {
    setLabel(transaction.label);
    setAmount(transaction.amount);
    setIsAddition(transaction.isAddition);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit && onSubmit(transaction, { label, amount, isAddition });
    reset();
    onClose();
  }

  return (
    <>
      {children && children({ onOpen })}
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>Edit the transaction</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing="0.5rem">
                <Input
                  value={label}
                  disabled={isSubmitting}
                  placeholder="Label"
                  onChange={(e) => setLabel(e.target.value)}
                />
                <Flex alignItems="center" columnGap="1rem">
                  <Flex
                    alignItems="center"
                    columnGap="0.25rem"
                    flexGrow="1"
                    shrink="1"
                    flexBasis="auto"
                  >
                    <span>$</span>
                    <NumberInput
                      value={amount}
                      min={0}
                      onChange={(_, value) => setAmount(value || 0)}
                    >
                      <NumberInputField disabled={isSubmitting} />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </Flex>
                  <RadioGroup
                    value={isAddition ? "in" : "out"}
                    onChange={(value) => setIsAddition(value === "in")}
                  >
                    <Flex columnGap="0.5rem">
                      <Radio
                        colorScheme="green"
                        value="in"
                        disabled={isSubmitting}
                      >
                        <Box color="green">Income</Box>
                      </Radio>
                      <Radio
                        colorScheme="red"
                        value="out"
                        disabled={isSubmitting}
                      >
                        <Box color="red">Expense</Box>
                      </Radio>
                    </Flex>
                  </RadioGroup>
                </Flex>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3}>
                Cancel
              </Button>
              <Button
                type="submit"
                isDisabled={!canSubmit}
                isLoading={isSubmitting}
                loadingText="Editing"
                colorScheme="teal"
              >
                Edit
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
