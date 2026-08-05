import ListReader from "./ListReader";

type EntryListReaderProps = {
    count?: number,
    onPress: () => void,
    children?: React.ReactNode,
};

export default function EntryListReader({
    count = Infinity,
    onPress,
    children,
}: EntryListReaderProps) {
    return <ListReader type="entry" count={count} onPress={onPress}>{children}</ListReader>;
}