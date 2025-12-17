import { Plus } from "lucide-react";

const AddPassword = ({ setShowAddForm }) => {
  return (
    <>
      <button
        onClick={() => setShowAddForm(true)}
        className="h-48 bg-white/10 backdrop-blur-lg rounded-2xl border-2 border-dashed border-white/30 hover:border-white/60 hover:bg-white/20 transition-all duration-300 flex items-center justify-center group"
      >
        <div className="text-center">
          <Plus className="w-12 h-12 text-white/70 group-hover:text-white mx-auto mb-2 transition-colors" />
          <span className="text-white/70 group-hover:text-white text-lg font-medium transition-colors">
            Add Password
          </span>
        </div>
      </button>
    </>
  );
};

export default AddPassword;
