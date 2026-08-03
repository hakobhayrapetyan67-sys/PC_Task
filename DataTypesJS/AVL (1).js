class AVLNode {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
        this.height = 1; // Նոր Node-ի բարձրությունը սկզբում 1 է
    }
}

class AVLTree {
    constructor() {
        this.root = null;
    }

    // 1. Օգնող ֆունկցիա Node-ի բարձրությունը ստանալու համար
    getHeight(node) {
        return node ? node.height : 0;
    }

    // 2. Հաշվում է Balance Factor-ը (Left Height - Right Height)
    getBalanceFactor(node) {
        return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
    }

    // 3. Թարմացնում է Node-ի բարձրությունը
    updateHeight(node) {
        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    }

    // ------------------ 🔄 ROTATIONS ------------------

    //  Right Rotation (LL Case-ի համար)
    rotateRight(y) {
        let x = y.left;
        let T2 = x.right;

        // Պտույտ
        x.right = y;
        y.left = T2;

        // Բարձրությունների թարմացում (նախ y-ն, հետո x-ը)
        this.updateHeight(y);
        this.updateHeight(x);

        return x; // Նոր root-ը դառնում է x-ը
    }

    // Left Rotation (RR Case-ի համար)
    rotateLeft(x) {
        let y = x.right;
        let T2 = y.left;

        // Պտույտ
        y.left = x;
        x.right = T2;

        // Բարձրությունների թարմացում
        this.updateHeight(x);
        this.updateHeight(y);

        return y; // Նոր root-ը դառնում է y-ը
    }

    // ------------------ ➕ INSERTION ------------------

    insert(val) {
        this.root = this._insertNode(this.root, val);
    }

    _insertNode(node, val) {
        // 1. Սովորական BST Insert
        if (!node) return new AVLNode(val);

        if (val < node.val) {
            node.left = this._insertNode(node.left, val);
        } else if (val > node.val) {
            node.right = this._insertNode(node.right, val);
        } else {
            return node; // Դուբլիկատ արժեքներ չենք թույլատրում
        }

        // 2. Թարմացնում ենք բարձրությունը
        this.updateHeight(node);

        // 3. Ստուգում ենք Balance Factor-ը
        let balance = this.getBalanceFactor(node);

        // 4. Եթե ծառը անբալանս է դարձել, անում ենք համապատասխան պտույտները.

        // Left Left (LL) Case
        if (balance > 1 && val < node.left.val) {
            return this.rotateRight(node);
        }

        // Right Right (RR) Case
        if (balance < -1 && val > node.right.val) {
            return this.rotateLeft(node);
        }

        // Left Right (LR) Case
        if (balance > 1 && val > node.left.val) {
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);
        }

        // Right Left (RL) Case
        if (balance < -1 && val < node.right.val) {
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);
        }

        return node;
    }

    // ------------------ 🗑️ DELETION ------------------

    delete(val) {
        this.root = this._deleteNode(this.root, val);
    }

    _getMinNode(node) {
        let current = node;
        while (current.left) current = current.left;
        return current;
    }

    _deleteNode(node, val) {
        // 1. Սովորական BST Delete
        if (!node) return null;

        if (val < node.val) {
            node.left = this._deleteNode(node.left, val);
        } else if (val > node.val) {
            node.right = this._deleteNode(node.right, val);
        } else {
            // Node-ը գտնվել է

            // Դեպք 1 ու 2: 1 կամ 0 երեխա
            if (!node.left || !node.right) {
                let temp = node.left ? node.left : node.right;
                if (!temp) {
                    node = null; // Երեխա չկա
                } else {
                    node = temp; // 1 երեխա կա
                }
            } else {
                // Դեպք 3: 2 երեխա -> գտնում ենք աջ ենթածառի ամենափոքրը (inorder successor)
                let temp = this._getMinNode(node.right);
                node.val = temp.val;
                node.right = this._deleteNode(node.right, temp.val);
            }
        }

        if (!node) return null;

        // 2. Թարմացնում ենք բարձրությունը
        this.updateHeight(node);

        // 3. Ստուգում ենք Balance Factor-ը
        let balance = this.getBalanceFactor(node);

        // 4. Վերականգնում ենք բալանսը (Rotations)

        // Left Left Case
        if (balance > 1 && this.getBalanceFactor(node.left) >= 0) {
            return this.rotateRight(node);
        }

        // Left Right Case
        if (balance > 1 && this.getBalanceFactor(node.left) < 0) {
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);
        }

        // Right Right Case
        if (balance < -1 && this.getBalanceFactor(node.right) <= 0) {
            return this.rotateLeft(node);
        }

        // Right Left Case
        if (balance < -1 && this.getBalanceFactor(node.right) > 0) {
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);
        }

        return node;
    }
}const avl = new AVLTree();

// Ավելացնում ենք տարրեր
avl.insert(10);
avl.insert(20);
avl.insert(30); // Այստեղ ավտոմատ կանի Rotate Left (10-20-30 -> Root-ը կդառնա 20)
avl.insert(40);
avl.insert(50);
avl.insert(25);

console.log("Root value:", avl.root.val); // 30
console.log("Root Height:", avl.root.height); // 3

// Ջնջում ենք Node
avl.delete(10);