import { WatchlistCreateSchema } from "@/lib/pb/types/pb-zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Button, HelperText, Modal, Portal, TextInput, useTheme } from "react-native-paper";
import { z } from "zod";
// use require to avoid typing issues with dropdown
const DropDown: any = require("react-native-paper-dropdown").default;

type FormData = z.infer<typeof WatchlistCreateSchema>;

interface WatchlistFormModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (data: FormData) => void;
  initialValues?: Partial<FormData>;
  submitLabel?: string;
}

export function WatchlistFormModal({ visible, onDismiss, onSubmit, initialValues, submitLabel = "Save" }: WatchlistFormModalProps) {
  const { colors } = useTheme();
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: "",
      overview: "",
      visibility: "public",
      ...initialValues,
    },
    resolver: zodResolver(WatchlistCreateSchema),
  });

  const [showDropDown, setShowDropDown] = useState(false);
  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={[styles.container, { backgroundColor: colors.surface }]}>
        <View style={styles.field}>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  label="Title"
                  mode="outlined"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
                {errors.title && <HelperText type="error">{errors.title.message}</HelperText>}
              </>
            )}
          />
        </View>
        <View style={styles.field}>
          <Controller
            control={control}
            name="overview"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  label="Overview"
                  mode="outlined"
                  multiline
                  numberOfLines={3}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
                {errors.overview && <HelperText type="error">{errors.overview.message}</HelperText>}
              </>
            )}
          />
        </View>
        <View style={styles.field}>
          {/* Visibility dropdown */}
          <Controller
            control={control}
            name="visibility"
            render={({ field: { onChange, value } }) => {
              const visibilityItems = [
                { label: "Public", value: "public" },
                { label: "Private", value: "private" },
                { label: "Followers Only", value: "followers_only" },
              ];
              return (
                <>
                  {/* @ts-ignore drop-down library typing */}
                  <DropDown
                    label="Visibility"
                    mode="outlined"
                    visible={showDropDown}
                    showDropDown={() => setShowDropDown(true)}
                    onDismiss={() => setShowDropDown(false)}
                    value={value}
                    setValue={onChange}
                    list={visibilityItems}
                  />
                  {errors.visibility && <HelperText type="error">{errors.visibility.message}</HelperText>}
                </>
              );
            }}
          />
        </View>
        <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.button}>
          {submitLabel}
        </Button>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    padding: 16,
    borderRadius: 8,
  },
  field: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
});
