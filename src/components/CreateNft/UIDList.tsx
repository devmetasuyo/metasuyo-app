import UIDListItemSimple from "./UIDListItemSimple";

interface Props {
  uids: string[];
  onRemoveUid: (index: number) => void;
  setUids: (uids: string[]) => void;
}

export default function UIDList({ uids, onRemoveUid }: Props) {
  return (
    <>
      <div>
        <h3>Lista de códigos a crear</h3>
        {uids.length === 0 ? (
          <p>Agrega un código</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {uids.map((uid, index) => (
              <UIDListItemSimple
                key={index}
                uid={uid}
                onRemove={() => onRemoveUid(index)}
              />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
