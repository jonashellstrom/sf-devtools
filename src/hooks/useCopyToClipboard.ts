function useCopyToClipboard() {
  const copyToClipboard = async (text: string) => {
    if (!navigator?.clipboard) return;

    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("Error copying to clipboard");
    }
  };

  return copyToClipboard;
}

export default useCopyToClipboard;
