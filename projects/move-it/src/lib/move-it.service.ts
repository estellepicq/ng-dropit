import { Injectable } from '@angular/core';
import { DimensionsPx, Bounds, DraggableMovingPosition, ResizableMovingDimensions } from './move-it-types';

@Injectable()
export class MoveItService {

  // Draggable and container positions
  containerDimensions: DimensionsPx;
  containerBounds: Bounds;
  draggableDimensions: DimensionsPx;
  draggableLeftRatio: number;
  draggableTopRatio: number;

  // Draggable element
  draggable: HTMLElement;
  handle: HTMLElement;

  // Resize
  resizeHandle: HTMLElement;

  constructor() { }

  initDraggableDimensions() {
    this.draggableDimensions = {
      left: this.draggable.offsetLeft,
      top: this.draggable.offsetTop,
      width: this.draggable.clientWidth,
      height: this.draggable.clientHeight
    };
  }

  getContainerDimensions(bounds: HTMLElement): void {
    const borderLeftWidth = window.getComputedStyle(bounds).borderLeftWidth !== '' ?
      parseInt(window.getComputedStyle(bounds).borderLeftWidth, 10) :
      0;
    const borderTopWidth = window.getComputedStyle(bounds).borderTopWidth !== '' ?
      parseInt(window.getComputedStyle(bounds).borderTopWidth, 10) :
      0;
    const containerRect = bounds.getBoundingClientRect();
    this.containerDimensions = {
      left: borderLeftWidth + containerRect.left,
      top: borderTopWidth + containerRect.top,
      width: bounds.clientWidth,
      height: bounds.scrollHeight
    };
  }

  getBounds(): void {
    this.containerBounds = {
      boundLeft: -this.draggableDimensions.left,
      boundRight: this.containerDimensions.width - this.draggableDimensions.width - this.draggableDimensions.left,
      boundTop: -this.draggableDimensions.top,
      boundBottom: this.containerDimensions.height - this.draggableDimensions.height - this.draggableDimensions.top,
    };
  }

  checkBounds(leftPos: number, topPos: number, columnWidth: number): Partial<DraggableMovingPosition> {
    let newLeftPos = Math.round(leftPos / columnWidth) * columnWidth;
    let newTopPos = Math.round(topPos / columnWidth) * columnWidth;
    let leftEdge = false;
    let rightEdge = false;
    let topEdge = false;
    let bottomEdge = false;

    if (newLeftPos < this.containerBounds.boundLeft) {
      newLeftPos = this.containerBounds.boundLeft;
      leftEdge = true;
    }
    if (newLeftPos > this.containerBounds.boundRight) {
      newLeftPos = this.containerBounds.boundRight;
      rightEdge = true;
    }
    if (newTopPos < this.containerBounds.boundTop) {
      newTopPos = this.containerBounds.boundTop;
      topEdge = true;
    }
    if (newTopPos > this.containerBounds.boundBottom) {
      newTopPos = this.containerBounds.boundBottom;
      bottomEdge = true;
    }

    return {
      offsetLeft: newLeftPos,
      offsetTop: newTopPos,
      leftEdge: leftEdge,
      rightEdge: rightEdge,
      topEdge: topEdge,
      bottomEdge: bottomEdge
    };
  }

  clearSelection(): void {
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    }
  }

  getOffsetX() {
    return this.draggable.style.transform !== '' ? Number(this.draggable.style.transform.match(/[-]{0,1}[\d]*[\.]{0,1}[\d]+/g)[0]) : 0;
  }

  getOffsetY() {
    return this.draggable.style.transform !== '' ? Number(this.draggable.style.transform.match(/[-]{0,1}[\d]*[\.]{0,1}[\d]+/g)[1]) : 0;
  }

  checkResizeBounds(x: number, y: number, columnWidth: number, minWidth: number, minHeight: number): ResizableMovingDimensions {
    const offsetX = this.getOffsetX();
    const offsetY = this.getOffsetY();
    let newX = Math.round((x - offsetX) / columnWidth ) * columnWidth;
    let newY = Math.round((y - offsetY) / columnWidth ) * columnWidth;

    console.log(x, y, newX, newY);

    if (newX < minWidth * columnWidth) {
      newX = minWidth * columnWidth;
    }

    if (newX > this.containerDimensions.width - offsetX) {
      newX = this.containerDimensions.width - offsetX;
    }

    if (newY < minHeight * columnWidth) {
      newY = minHeight * columnWidth;
    }

    if (newY > this.containerDimensions.height - offsetY) {
      newY = this.containerDimensions.height - offsetY;
    }

    return {
      x: newX,
      y: newY
    };
  }



}
