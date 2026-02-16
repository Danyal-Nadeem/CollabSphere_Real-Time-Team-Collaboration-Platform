function Spinner() {
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-slate-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="w-16 h-16 border-4 border-sky-600 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
    );
}

export default Spinner;
