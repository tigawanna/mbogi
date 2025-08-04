import { StyleSheet, View } from "react-native";
import { DataTable } from "react-native-paper";
import { useCommunityWatchlistPage } from "../hooks";

interface CommunityListFooterProps {
  totalPages?: number;
  perPage?: number;
}

export function CommunityListFooter({ totalPages, perPage }: CommunityListFooterProps) {
  const { page, setPage } = useCommunityWatchlistPage();
  return (
    <View style={styles.container}>
      {(page && totalPages) ? (
        <DataTable.Pagination
          page={page || 1}
          numberOfPages={totalPages}
          onPageChange={(page) => setPage(page)}
          label={`${page} of ${totalPages}`}
          showFastPaginationControls
          // numberOfItemsPerPageList={numberOfItemsPerPageList}
          numberOfItemsPerPage={perPage}
          // onItemsPerPageChange={onItemsPerPageChange}
          selectPageDropdownLabel={"Rows per page"}
        />
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
