import subprocess
import tempfile
import os

def detect_errors(code, language):
    if language == 'python':
        return check_python(code)
    elif language == 'c':
        return check_c(code)
    elif language == 'cpp':
        return check_cpp(code)
    elif language == 'java':
        return check_java(code)
    else:
        return {"error": "Unsupported language"}

def check_python(code):
    with tempfile.NamedTemporaryFile(suffix='.py', delete=False) as tmp:
        tmp.write(code.encode('utf-8'))
        tmp_path = tmp.name
    
    try:
        # Use compile() to check for syntax errors without executing
        compile(code, '<string>', 'exec')
        return {"status": "success", "message": "No syntax errors found in Python code."}
    except SyntaxError as e:
        return {
            "status": "error",
            "message": f"Syntax Error: {e.msg}",
            "line": e.lineno,
            "offset": e.offset,
            "text": e.text
        }
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

def check_c(code):
    return check_compiled(code, '.c', ['gcc', '-fsyntax-only'])

def check_cpp(code):
    return check_compiled(code, '.cpp', ['g++', '-fsyntax-only'])

def check_java(code):
    # Java is trickier because the filename must match the class name.
    # For a simple detector, we'll try to find the class name or use a default.
    import re
    match = re.search(r'public\s+class\s+(\w+)', code)
    class_name = match.group(1) if match else "TempClass"
    
    with tempfile.TemporaryDirectory() as tmpdir:
        file_path = os.path.join(tmpdir, f"{class_name}.java")
        with open(file_path, 'w') as f:
            f.write(code)
        
        process = subprocess.run(['javac', file_path], capture_output=True, text=True)
        if process.returncode == 0:
            return {"status": "success", "message": "No errors found in Java code."}
        else:
            return {"status": "error", "message": process.stderr}

def check_compiled(code, suffix, cmd_base):
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(code.encode('utf-8'))
        tmp_path = tmp.name
    
    try:
        cmd = cmd_base + [tmp_path]
        process = subprocess.run(cmd, capture_output=True, text=True)
        if process.returncode == 0:
            return {"status": "success", "message": f"No errors found in {suffix[1:].upper()} code."}
        else:
            # Clean up the path from the error message to avoid leaking internal structure
            error_msg = process.stderr.replace(tmp_path, "code" + suffix)
            return {"status": "error", "message": error_msg}
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
