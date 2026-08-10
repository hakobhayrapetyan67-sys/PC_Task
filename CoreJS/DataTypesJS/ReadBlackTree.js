const RED = "RED";
const BLACK = "BLACK";

class RBNode {
    constructor(val, color = RED) {
        this.val = val;
        this.color = color; // Նոր Node-երը միշտ սկզբում RED են ավելացվում
        this.left = null;
        this.right = null;
        this.parent = null;
    }
}

class RedBlackTree {
    constructor() {
        // NIL Node - հանդիսանում է բոլոր դատարկ (null) տերևների փոխարինողը
        this.NIL = new RBNode(null, BLACK);
        this.root = this.NIL;
    }

    // ------------------ 🔄 ROTATIONS ------------------

    // Left Rotation
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

    // Right Rotation
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

    // ------------------ ➕ INSERTION ------------------

    insert(val) {
        let newNode = new RBNode(val);
        newNode.left = this.NIL;
        newNode.right = this.NIL;

        let parent = null;
        let curr = this.root;

        // 1. Սովորական BST Insert
        while (curr !== this.NIL) {
            parent = curr;
            if (newNode.val < curr.val) {
                curr = curr.left;
            } else if (newNode.val > curr.val) {
                curr = curr.right;
            } else {
                return; // Դուբլիկատներ չենք ավելացնում
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

        // 2. Վերականգնում ենք Red-Black կանոնները
        this.fixInsert(newNode);
    }

    // ------------------ 🛠️ FIX INSERTION ------------------

    fixInsert(node) {
        // Քանի դեռ ծնողը RED է (կանոն 4-ի խախտում)
        while (node.parent && node.parent.color === RED) {
            let parent = node.parent;
            let grandParent = parent.parent;

            // ԴԵՊՔ A: Ծնողը Grandparent-ի ՁԱԽ երեխան է
            if (parent === grandParent.left) {
                let uncle = grandParent.right; // Մորաքույր / Հորաքույր

                // Case 1: Uncle-ը RED է -> Recoloring (Գույների փոխում)
                if (uncle.color === RED) {
                    parent.color = BLACK;
                    uncle.color = BLACK;
                    grandParent.color = RED;
                    node = grandParent; // Առաջ ենք գնում դեպի վերև
                } else {
                    // Case 2: Uncle-ը BLACK է, իսկ Node-ը ԱՋ երեխա է (LR shape)
                    if (node === parent.right) {
                        node = parent;
                        this.rotateLeft(node);
                    }
                    // Case 3: Uncle-ը BLACK է, իսկ Node-ը ՁԱԽ երեխա է (LL shape)
                    node.parent.color = BLACK;
                    grandParent.color = RED;
                    this.rotateRight(grandParent);
                }
            } 
            // ԴԵՊՔ B: Ծնողը Grandparent-ի ԱՋ երեխան է (հայելային դեպքը)
            else {
                let uncle = grandParent.left;

                // Case 1: Uncle-ը RED է -> Recoloring
                if (uncle.color === RED) {
                    parent.color = BLACK;
                    uncle.color = BLACK;
                    grandParent.color = RED;
                    node = grandParent;
                } else {
                    // Case 2: Node-ը ՁԱԽ երեխա է (RL shape)
                    if (node === parent.left) {
                        node = parent;
                        this.rotateRight(node);
                    }
                    // Case 3: Node-ը ԱՋ երեխա է (RR shape)
                    node.parent.color = BLACK;
                    grandParent.color = RED;
                    this.rotateLeft(grandParent);
                }
            }
        }

        // Root-ը ՄԻՇՏ BLACK է (Կանոն 2)
        this.root.color = BLACK;
    }
}
const rbTree = new RedBlackTree();

rbTree.insert(10);
rbTree.insert(20);
rbTree.insert(30); // Այստեղ կանի Rotation ու Recoloring

console.log("Root:", rbTree.root.val); // 20
console.log("Root Color:", rbTree.root.color); // BLACK
console.log("Left Child:", rbTree.root.left.val, rbTree.root.left.color); // 10, RED
console.log("Right Child:", rbTree.root.right.val, rbTree.root.right.color); // 30, RED