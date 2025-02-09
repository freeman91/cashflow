

# check if PID is running, if it is, kill it and log the PID, if not print "PID not found"
function kill_pid() {
    PID=$(lsof -t -i :4242)
    if [ -n "$PID" ]; then
        echo "KILLING PID: $PID"
        kill -9 $PID
    else
        echo "PID not found"
    fi
}

# function that pulls in the latest changes and logs how many changes
function pull_changes() {
    git pull origin "$(git_current_branch)"
    echo "Pulled $(git log --oneline | wc -l) changes"
}


kill_pid
pull_changes

echo "Building..."
yarn build

echo "Serving..."
yarn serve

echo "Deployed"
