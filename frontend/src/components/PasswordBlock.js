import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { MdCancel } from "react-icons/md";

const PasswordBlock = ({
  passwords,
  visiblePasswords,
  togglePasswordVisibility,
  handleDelete,
  loading
}) => {
  return (
    <>
      {loading ? 
      <div className="text-center mt-12">
        <p className="text-white/60 text-lg">Your passwords will show up within a moment...👮👮👮</p>
      </div>
      : 
      passwords.map((pwd) => (
        <div
          key={pwd.id}
          className="h-48 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative group"
        >
          {/* Delete Button */}
          <button
            onClick={() => handleDelete(pwd.id)}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
            title="Delete"
          >
            <MdCancel className="w-4 h-4" />
          </button>

          <div className="flex flex-col h-full justify-between">
            <div className="space-y-4">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider mb-1">
                  Account
                </p>
                <h3 className="text-white text-xl font-bold truncate">
                  {pwd.accountname}
                </h3>
              </div>
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider mb-1">
                  Password
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-white font-mono text-sm flex-1 truncate">
                    {visiblePasswords[pwd.id] ? pwd.plaintext : "••••••••••"}
                  </p>
                  <button
                    onClick={() => togglePasswordVisibility(pwd.id)}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {visiblePasswords[pwd.id] ? (
                      <IoEyeOffOutline className="w-4 h-4" />
                    ) : (
                      <IoEyeOutline className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))
    }
    </>
  );
};

export default PasswordBlock;
