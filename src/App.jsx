import React, { useEffect, useState } from 'react';
import { useContract, useContractWrite, useContractRead, useAddress, ConnectWallet } from '@thirdweb-dev/react'; 
import abi from './abi.json'; 
import { MdRadioButtonUnchecked } from "react-icons/md";
import { GoCheckCircleFill } from "react-icons/go";

const contractAddress = "0x80586ec16cf764591f96dfec7fc294f35e0967e9"; // Ensure the contract address is correct

function App() {
  const address = useAddress(); // Get connected wallet address

  const { contract } = useContract(contractAddress, abi); // Connect to your contract using the ABI

  const [taskDescription, setTaskDescription] = useState('');

  // Handle contract interactions with appropriate checks
  const { mutateAsync: createTask, isLoading: isCreatingTask } = useContractWrite(contract, "createTask");
  const { mutateAsync: toggleTaskCompleted, isLoading: isTogglingTask } = useContractWrite(contract, "toggleTaskCompleted");
  const { data: fetchedTasks, refetch: fetchTasks, isFetching } = useContractRead(contract, "getAllTasksByUser", [address]);

  const handleCreateTask = async (event) => {
    event.preventDefault();
    if (!taskDescription || isCreatingTask) return;

    try {
      await createTask({ args: [taskDescription] });
      setTaskDescription(''); // Reset task input
      fetchTasks(); // Refetch tasks after creation
    } catch (error) {
      console.error("Failed to create task:", error.message || error);
    }
  };

  const handleToggleTaskComplete = async (taskId) => {
    if (isTogglingTask) return;

    try {
      await toggleTaskCompleted({ args: [taskId] });
      fetchTasks(); // Refetch tasks after toggling
    } catch (error) {
      console.error("Failed to toggle task:", error.message || error);
    }
  };

  useEffect(() => {
    if (contract && address) {
      fetchTasks(); // Fetch tasks when contract and address are available
    }
  }, [contract, address]);

  return (
    <div className="w-full">
      <div className='flex items-center justify-between w-full h-[80px] bg-white px-[6%] py-4 shadow-[0px_0px_3px_rgba(0,0,0,0.1)]'>
        <h2 className="text-xl font-bold text-gray-900">Todo <span className="text-[#00b2f2]">DApp</span></h2>
        <ConnectWallet theme={'light'} />
      </div>
      
      <div className="w-full items-center flex flex-col gap-2 md:gap-4">
        <form onSubmit={handleCreateTask} className="mt-4 w-full md:w-1/2 flex items-center gap-3 p-4 md:p-0">
          <input 
            type="text" 
            placeholder='Create new task' 
            className="w-full rounded-lg border border-solid border-[#bebebe] outline-[#00b2f2] px-3 py-2" 
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
          <button 
            className="bg-[#42b7ed] hover:bg-[#00b2f2] text-white px-4 py-3 rounded-lg" 
            disabled={isCreatingTask || !taskDescription}
          >
            {isCreatingTask ? "Adding..." : "Add"}
          </button>
        </form>

        {isFetching ? (
          <div>Loading tasks...</div>
        ) : (
          <div className="w-full md:w-1/2 flex flex-col gap-4 p-4 md:p-0">
            {fetchedTasks && fetchedTasks.map((task, index) => (
              <div key={index} className="w-full px-5 py-4 bg-white rounded-lg shadow-[0px_0px_3px_rgba(0,0,0,0.1)] flex justify-between items-center">
                <h3 className="text-lg text-gray-950">{task.content}</h3>
                <span
                  onClick={() => handleToggleTaskComplete(task.id)}
                  className={`cursor-pointer text-xl ${task.completed ? "text-green-500" : "text-orange-500"}`}
                >
                  {task.completed ? (<GoCheckCircleFill  />) : (<MdRadioButtonUnchecked />)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;