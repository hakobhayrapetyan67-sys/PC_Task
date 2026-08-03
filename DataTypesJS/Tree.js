class Node{
    constructor(value){
        this.value = value;
        this.left = null;
        this.right = null;
    }
}
class BST{
    constructor(){
        this.root = null;
    }
    insert(value){
        let newNode = new Node(value);
        if(this.root === null){
            this.root = newNode;
            return;
        }
        let curr = this.root;
        while(curr){
            if(curr.value > value){
                if(!curr.left){
                    curr.left = newNode;
                    return;
                }
                curr = curr.left;
            } else if(curr.value < value){
                if(!curr.right){
                    curr.right = newNode;
                    return;
                }
                curr = curr.right;
            }
        }
    }
    contains(value){
        let curr = this.root;
        while(curr){
            if(curr.value === value) return true;
            if(curr.value < value){
                curr = curr.right;
            }
            if(curr.value > value){
                curr = curr.left;
            }
        }
        return false;
    }
    min(){
        if(!this.root) return null;
        let curr = this.root;
        while(curr.left){
            curr = curr.left;
        }
        return curr.value;
    }
    max(){
        if(!this.root) return null;
        let curr = this.root;
        while(curr.right){
            curr = curr.right;
        }
        return curr.value;
    }
    inOrder(){
        if(!this.root) return;
        let stack = [];
        let curr = this.root;
        while(curr || stack.length > 0){
            while(curr){
                stack.push(curr);
                curr = curr.left;
            }
            curr = stack.pop();
            console.log(curr);
            curr = curr.right;
        }
    }
    preOrder(){
        if(!this.root) return;
        let stack = [this.root];
        while(stack.length > 0){
            let node = stack.pop();
            console.log(node);
            if(node.right) stack.push(node.right);
            if(node.left) stack.push(node.left);
        }
    }
    postOrder(){
        if(!this.root) return;
        let stack1 = [this.root];
        let stack2 = [];

        while(stack1.length){
            let node = stack1.pop();
            stack2.push(node);
            if(node.left){
                stack1.push(node.left);
            }
            if(node.right){
                stack1.push(node.right);
            }
        }
        while(stack2.length){
            console.log(stack2.pop().value);
        }
    }
    levelOrder(){
        if(!this.root) return;
        let q = new Queue();
        q.enqueue(this.root);
        while(!q.isEmpty()){
            let level = q.size();
            for(let i = 0; i < level; ++i){
                const node = q.dequeue();
                console.log(node.value);
                if(node.left) q.enqueue(node.left);
                if(node.right) q.enqueue(node.right);
            }
        }
    }
}