import { Save } from "lucide-react";

const PostPassword = ({ newAccount, setNewAccount, handleAddPassword, setShowAddForm }) => {
    return (
        <div className="h-48 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg rounded-2xl border border-white/30 p-6 shadow-xl">
              <div className="flex flex-col h-full justify-between">
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Account Name"
                    value={newAccount.accountName}
                    onChange={(e) =>
                      setNewAccount({
                        ...newAccount,
                        accountName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={newAccount.password}
                    onChange={(e) =>
                      setNewAccount({ ...newAccount, password: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddPassword}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewAccount({ accountName: "", password: "" });
                    }}
                    className="px-4 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
    )
}

export default PostPassword;