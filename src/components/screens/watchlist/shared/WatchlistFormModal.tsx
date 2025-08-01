import { useSnackbarStore } from "@/components/react-native-paper/snackbar/global-snackbar-store";
import { pb } from "@/lib/pb/client";
import { WatchlistCreateSchema } from "@/lib/pb/types/pb-zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Divider,
  HelperText,
  Modal,
  Portal,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import { z } from "zod";

// Local form schema overriding title to be required
const FormSchema = WatchlistCreateSchema.extend({
  title: z.string().min(1, "Title is required"),
});

type FormData = z.infer<typeof FormSchema>;

interface WatchlistFormModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (data: FormData) => void;
  initialValues?: Partial<FormData>;
  submitLabel?: string;
  isMutationPending?: boolean;
}

export function WatchlistFormModal({
  visible,
  onDismiss,
  onSubmit,
  initialValues,
  isMutationPending,
  submitLabel = "Save",
}: WatchlistFormModalProps) {
  const { colors } = useTheme();
  const { showSnackbar } = useSnackbarStore();
  const currentUserId = pb.authStore?.record?.id;
  const visibilityOptions = [
    { label: "🌍 Public", value: "public" },
    { label: "🔒 Private", value: "private" },
    { label: "👥 Followers Only", value: "followers_only" },
  ];
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: initialValues?.title || "",
      overview: initialValues?.overview || "",
      visibility: initialValues?.visibility || "public",
    },
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    if (initialValues) {
      setValue("title", initialValues?.title || "");
      setValue("overview", initialValues?.overview || "");
      setValue("visibility", initialValues?.visibility || "public");
    }
    if (currentUserId) {
      setValue("user_id", currentUserId);
    } else {
      showSnackbar("You must be logged in to create a watchlist.", {
        duration: 10_000,
      });
    }
  }, [initialValues, setValue, showSnackbar, currentUserId]);
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[styles.container, { backgroundColor: colors.surface }]}>
        <View style={styles.header}>
          <Text variant="titleLarge" style={[styles.title, { color: colors.onSurface }]}>
            {initialValues ? "Edit Watchlist" : "Create New Watchlist"}
          </Text>
          <Divider style={styles.divider} />
        </View>

        <View style={styles.content}>
          <View style={styles.field}>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TextInput
                    label="Watchlist Title"
                    mode="outlined"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={!!errors.title}
                    style={styles.input}
                  />
                  {errors.title && (
                    <HelperText type="error" style={styles.errorText}>
                      {errors.title.message}
                    </HelperText>
                  )}
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
                    label="Description (Optional)"
                    mode="outlined"
                    multiline
                    numberOfLines={3}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={!!errors.overview}
                    style={styles.input}
                  />
                  {errors.overview && (
                    <HelperText type="error" style={styles.errorText}>
                      {errors.overview.message}
                    </HelperText>
                  )}
                </>
              )}
            />
          </View>

          <View style={styles.field}>
            <Controller
              control={control}
              name="visibility"
              render={({ field: { onChange, value } }) => (
                <>
                  <Dropdown
                    label="Visibility"
                    placeholder="Select visibility"
                    options={visibilityOptions}
                    value={value}
                    onSelect={onChange}
                    mode="outlined"
                    error={!!errors.visibility}
                  />
                  {errors.visibility && (
                    <HelperText type="error" style={styles.errorText}>
                      {errors.visibility.message}
                    </HelperText>
                  )}
                </>
              )}
            />
          </View>
        </View>

        <View style={styles.actions}>
          <Button mode="outlined" onPress={onDismiss} style={[styles.button, styles.cancelButton]}>
            Cancel
          </Button>
          <Button
            mode="contained"
            loading={isMutationPending}
            onPress={handleSubmit(onSubmit)}
            style={[styles.button, styles.submitButton]}>
            {submitLabel} {isMutationPending && "..." /* Show loading state if needed */}
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderRadius: 16,
    maxHeight: "80%",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  divider: {
    marginTop: 8,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  field: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: "transparent",
  },
  errorText: {
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 8,
  },
  cancelButton: {
    marginRight: 6,
  },
  submitButton: {
    marginLeft: 6,
  },
});
