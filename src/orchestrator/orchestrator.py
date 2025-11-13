
from agents.filesystem_agent import FileSystemAgent
from agents.code_generation_agent import CodeGenerationAgent

class OrchestratorAgent:
    def __init__(self):
        self.filesystem_agent = FileSystemAgent()
        self.code_generation_agent = CodeGenerationAgent()

    def handle_command(self, command):
        if "file" in command:
            if "list" in command:
                return self.filesystem_agent.list_files(".")
            elif "read" in command:
                # In a real implementation, you would parse the file path from the command
                return self.filesystem_agent.read_file("example.py")
            elif "write" in command:
                # In a real implementation, you would parse the file path and content from the command
                return self.filesystem_agent.write_file("example.py", "# New content")
        elif "code" in command or "generate" in command:
            return self.code_generation_agent.generate_code(command)
        else:
            return "Command not understood. Please use commands related to 'file' or 'code'."

if __name__ == "__main__":
    orchestrator = OrchestratorAgent()
    # Example usage
    result = orchestrator.handle_command("list files")
    print(result)
    result = orchestrator.handle_command("generate code for a function that adds two numbers")
    print(result)
