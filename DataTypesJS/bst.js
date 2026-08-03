class Node {
    constructor(value){
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree{
    constructor(){
        this.root = null;
    }
   
    insert(value){
        if(!this.root){
            this.root = new Node(value);
            return;
        }
        let curr = this.root;
        while(curr){
            if(value < curr.value){
                if(!curr.left){
                    curr.left = new Node(value);
                    return;
                }
                curr = curr.left;
            } else if(value > curr.value){
                if(!curr.right){
                    curr.right = new Node(value);
                    return;
                }
                curr = curr.right;
            } 
        }
    }
    contains(value){
        if(!this.root) return false;
        let curr = this.root;
        while(curr){
            if(value < curr.value){
                curr = curr.left;
            } else if(value > curr.value){
                curr = curr.right;
            } else if(curr.value == value){
                return true;
            }
        }
        return false;
    }
    min(){
        if(!this.root) return false;
        let curr = this.root;
        while(curr.left){
            curr = curr.left;
        }
        return curr.value;
    }
    max(){
        if(!this.root) return false;
        let curr = this.root;
        while(curr.right){
            curr = curr.right;
        }
        return curr.value;
    }
    inorder(){
        if(!this.root) return false;
        const stack = [];
        let curr = this.root;
        while(curr || stack.length > 0){
            while(curr){
                stack.push(curr);
                curr = curr.left;
            }
            curr = stack.pop();
            curr = curr.right;
        }
    }
    preorder(){
        if(!this.root) return false;
       const res = [];
       const stack = [this.root];
       while(stack.length){
        const node = stack.pop();
        res.push(node.value);
        if(node.right){
            stack.push(node.right);
        }
        if(node.lefth){
            stack.push(node.left);
        }
       }
    }
}