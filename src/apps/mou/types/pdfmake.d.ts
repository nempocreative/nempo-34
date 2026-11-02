declare module 'pdfmake/build/pdfmake.js' {
  const pdfMake: {
    addVirtualFileSystem(files: Record<string, string>): void;
    createPdf(definition: unknown): {
      download(fileName: string): void;
    };
  };

  export default pdfMake;
}

declare module 'pdfmake/build/vfs_fonts.js' {
  const virtualFiles: Record<string, string>;

  export default virtualFiles;
}
