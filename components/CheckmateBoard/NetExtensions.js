import { Modal, Button, ButtonToolbar, FormControl } from "react-bootstrap";
import styles from './Chessboard.module.css';

export function ExportModal({ show, handleClose, string, allowDownload, allowShare, mode }) {

  function share() {
    if (!navigator.canShare) {
      return alert("Your browser does not support this function.");
    }

    let shareData = {
      title: "Checkmate Game",
      text: string,
      url: (mode != "link") ? (window.location.protocol + "//" + window.location.host + "/") : (window.location)
    }

    if (!navigator.canShare(shareData)) {
      return alert("Your browser cannot share this type of data.");
    }

    navigator.share(shareData).then(handleClose)
  }

  function toClipboard() {
    return navigator.clipboard.writeText(string)
    .then(handleClose)
    .catch((err) => {
      console.error(err);
      alert("Your browser is unable to access the clipboard.")
    });
  }

  async function download() {
    const blob = new Blob([string], { type: (mode === "pgn") ? 'application/x-chess-pgn' : 'application/x-chess-fen'})
    const url = window.URL.createObjectURL(blob);

    if (window.showSaveFilePicker) {

      let types = {
        pgn: {
          description: 'PGN File',
          accept: {'application/x-chess-pgn': ['.pgn']}
        },
        fen: {
          description: 'FEN File',
          accept: {'application/x-chess-fen': ['.fen']}
        }
      }

      const options = {
        types: [
          ((mode === "pgn") ? types.pgn : types.fen), // this is so scuffed
          {
            description: "Text File",
            accept: {'text/plain': ['.txt']}
          }
        ],
        suggestedName: (mode === "pgn") ? 'game.pgn' : 'game.fen'
      }

      let handle;
      try {
        handle = await window.showSaveFilePicker(options);
      } catch {
        return alert("Unable to save file.");
      }

      const writable = await handle.createWritable();

      await writable.write(string);

      await writable.close();

      handleClose();

      return;
    }

    const link = document.createElement('a');
    link.className = "d-none";
    link.download = (mode === "pgn") ? 'game.pgn' : 'game.fen';
    link.href = {url};

    document.body.appendChild(link); // for firefox!
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);

    handleClose();
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Share game</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ButtonToolbar className={"mb-2"} aria-label={"Share options"}>
          {allowShare
          ? <Button onClick={share} className={"me-2"} variant={"primary"}>Share</Button>
          : undefined
          }
          <Button onClick={toClipboard} className={"me-2"} variant={"secondary"}>Copy to Clipboard</Button>
          {allowDownload
          ? <Button onClick={download} className={"me-2"} variant={"secondary"}>Download</Button>
          : undefined
          }
        </ButtonToolbar>
        <FormControl
          as="textarea"
          readOnly={true}
          draggable={false}
          cols={50}
          rows={2}
          id={styles.shareTextArea}
        >
          {string}
        </FormControl>
      </Modal.Body>
    </Modal>
  )
}