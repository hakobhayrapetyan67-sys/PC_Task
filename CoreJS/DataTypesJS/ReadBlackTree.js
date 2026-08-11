const RED = "RED";
const BLACK = "BLACK";

class RBNode {
    constructor(val, color = RED) {
        this.val = val;
        this.color = color; 
        this.left = null;
        this.right = null;
        this.parent = null;
    }
}

class RedBlackTree {
    constructor() {
        this.NIL = new RBNode(null, BLACK);
        this.root = this.NIL;
    }
    rotateLeft(x) {
        let y = x.right;
        x.right = y.left;

        if (y.left !== this.NIL) {
            y.left.parent = x;
        }

        y.parent = x.parent;

        if (x.parent === null) {
            this.root = y;
        } else if (x === x.parent.left) {
            x.parent.left = y;
        } else {
            x.parent.right = y;
        }

        y.left = x;
        x.parent = y;
    }
    rotateRight(x) {
        let y = x.left;
        x.left = y.right;

        if (y.right !== this.NIL) {
            y.right.parent = x;
        }

        y.parent = x.parent;

        if (x.parent === null) {
            this.root = y;
        } else if (x === x.parent.right) {
            x.parent.right = y;
        } else {
            x.parent.left = y;
        }

        y.right = x;
        x.parent = y;
    }
    insert(val) {
        let newNode = new RBNode(val);
        newNode.left = this.NIL;
        newNode.right = this.NIL;

        let parent = null;
        let curr = this.root;
        while (curr !== this.NIL) {
            parent = curr;
            if (newNode.val < curr.val) {
                curr = curr.left;
            } else if (newNode.val > curr.val) {
                curr = curr.right;
            } else {
                return;
            }
        }

        newNode.parent = parent;

        if (parent === null) {
            this.root = newNode;
        } else if (newNode.val < parent.val) {
            parent.left = newNode;
        } else {
            parent.right = newNode;
        }
        this.fixInsert(newNode);
    }


    fixInsert(node) {
        while (node.parent && node.parent.color === RED) {
            let parent = node.parent;
            let grandParent = parent.parent;

        
            if (parent === grandParent.left) {
                let uncle = grandParent.right; 

          
                if (uncle.color === RED) {
                    parent.color = BLACK;
                    uncle.color = BLACK;
                    grandParent.color = RED;
                    node = grandParent; 
                } else {
                    
                    if (node === parent.right) {
                        node = parent;
                        this.rotateLeft(node);
                    }
               
                    node.parent.color = BLACK;
                    grandParent.color = RED;
                    this.rotateRight(grandParent);
                }
            } 
         
            else {
                let uncle = grandParent.left;

        
                if (uncle.color === RED) {
                    parent.color = BLACK;
                    uncle.color = BLACK;
                    grandParent.color = RED;
                    node = grandParent;
                } else {
                   
                    if (node === parent.left) {
                        node = parent;
                        this.rotateRight(node);
                    }
             
                    node.parent.color = BLACK;
                    grandParent.color = RED;
                    this.rotateLeft(grandParent);
                }
            }
        }


        this.root.color = BLACK;
    }
}
const rbTree = new RedBlackTree();

rbTree.insert(10);
rbTree.insert(20);
rbTree.insert(30); 

console.log("Root:", rbTree.root.val); 
console.log("Root Color:", rbTree.root.color);
console.log("Left Child:", rbTree.root.left.val, rbTree.root.left.color); 
console.log("Right Child:", rbTree.root.right.val, rbTree.root.right.color);
